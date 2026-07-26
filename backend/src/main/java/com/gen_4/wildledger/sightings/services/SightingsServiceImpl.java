package com.gen_4.wildledger.sightings.services;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gen_4.wildledger.auth.models.User;
import com.gen_4.wildledger.auth.repositories.UserRepository;
import com.gen_4.wildledger.sightings.models.Sighting;
import com.gen_4.wildledger.sightings.models.SightingProxy;
import com.gen_4.wildledger.sightings.models.SightingStatus;
import com.gen_4.wildledger.sightings.repositories.SightingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SightingsServiceImpl implements SightingsService {

    private final SightingRepository sightingRepository;

    private final UserRepository userRepository;

    private final StorageService storageService;

    private final RedisTemplate<String, String> redisTemplate;
    
    @Transactional
    @Override
    public Sighting createSighting(
        long userId, 
        double latitude, 
        double longitude, 
        LocalDateTime sightingDate,
        String extension,
        MultipartFile file
    ) {
        Optional<User> user = userRepository.findById(userId);
        Sighting sighting = Sighting.builder()
            .latitude(latitude)
            .longitude(longitude)
            .sightingDate(Timestamp.valueOf(sightingDate))
            .reporter(user.get())
            .extension(extension)
            .build();

        String sanitizedUsername = sighting.getReporter().getUsername().replace("/", "_").replace("\\", "_").replace(".", "_");
        String imagePath = sanitizedUsername + "/" + UUID.randomUUID() + "." + extension;
        sighting.setImagePath(imagePath);

        sighting = sightingRepository.save(sighting);
        log.info("User {} created new sighting with id: {}", userId, sighting.getId());

        try {
            storageService.saveSightingImage(file, sighting.getImagePath());
        } catch (Exception e) {
            log.warn("Failed to save image for sighting {}. Sighting will be marked as failed_image.", sighting.getId());
            sighting.setStatus(SightingStatus.FAILED_IMAGE);
            sighting = sightingRepository.save(sighting);
            throw e;
        }
        log.info("Image saved for sighting {} with path: {}", sighting.getId(), sighting.getImagePath());

        redisTemplate.opsForStream().add(
            StreamRecords.newRecord()
                .ofObject(Map.of("id", String.valueOf(sighting.getId()), "image_path", sighting.getImagePath()))
                .withStreamKey("sighting:creation")
        );
        log.info("Sighting {} sent to be processed", sighting.getId());
        
        Hibernate.initialize(sighting.getReporter().getUsername());
        Hibernate.initialize(sighting.getIndividual()); 
        return sighting;
    }

    @Transactional(readOnly = true)
    @Override
    public List<SightingProxy> getSightings() {
        // TODO: This must just return the ones that are in a decent state, prolly confirmed
        return sightingRepository.findAllWithIndividual();
    }

}

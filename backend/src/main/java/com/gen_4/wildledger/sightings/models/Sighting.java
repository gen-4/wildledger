package com.gen_4.wildledger.sightings.models;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.gen_4.wildledger.auth.models.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"reporter", "individual"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Sighting {

    @Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Individual individual;

    private Float identificationConfidence;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false, updatable = false, unique = true)
    private String imagePath;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SightingStatus status = SightingStatus.PENDING;

    @Column(nullable = false)
    private Timestamp sightingDate;

    @Column(nullable = false, updatable = false)
	private Timestamp createdAt;

    private Timestamp updatedAt;

    @Transient
    private String extension;

    @PrePersist
    protected void onCreate() {
        createdAt = Timestamp.valueOf(LocalDateTime.now());
        updatedAt = Timestamp.valueOf(LocalDateTime.now());
        if (imagePath == null && reporter != null && this.extension != null) {
            String sanitizedUsername = reporter.getUsername().replace("/", "_").replace("\\", "_").replace(".", "_");
            sanitizedUsername = StandardCharsets.UTF_8.decode(StandardCharsets.UTF_8.encode(sanitizedUsername)).toString();
            this.imagePath = sanitizedUsername + "/" + this.id + "." + this.extension;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Timestamp.valueOf(LocalDateTime.now());
    }
    
}

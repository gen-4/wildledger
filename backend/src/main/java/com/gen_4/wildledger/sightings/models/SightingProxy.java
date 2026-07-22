package com.gen_4.wildledger.sightings.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SightingProxy {

    private long id;
    private Long individualId;
    private String name;
    private double latitude;
    private double longitude;
    private String imagePath;

}

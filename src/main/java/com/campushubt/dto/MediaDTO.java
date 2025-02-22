package com.campushubt.dto;

import lombok.Data;

@Data
public class MediaDTO {
    private Long id;
    private String url;
    private String type;
    private Integer width;
    private Integer height;
    private String aspectRatio;
} 
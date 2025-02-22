package com.campushubt.mapper;

import com.campushubt.dto.PostDTO;
import com.campushubt.model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "id", source = "postId")
    @Mapping(target = "isLiked", constant = "false")
    PostDTO toDTO(Post post);
}
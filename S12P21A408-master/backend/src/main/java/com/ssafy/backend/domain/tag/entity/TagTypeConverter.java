package com.ssafy.backend.domain.tag.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class TagTypeConverter implements AttributeConverter<TagType, Integer> {

	@Override
	public Integer convertToDatabaseColumn(TagType tagType) {
		return tagType.getCode();
	}

	@Override
	public TagType convertToEntityAttribute(Integer integer) {
		return TagType.of(integer);
	}
}

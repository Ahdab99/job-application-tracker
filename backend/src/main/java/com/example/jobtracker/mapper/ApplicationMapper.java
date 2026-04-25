package com.example.jobtracker.mapper;

import com.example.jobtracker.dto.JobAppResponse;
import com.example.jobtracker.entity.Application;

public class ApplicationMapper {

    public static JobAppResponse toResponse(Application application) { // Entity → ResponseDTO
        JobAppResponse response = new JobAppResponse();

        // Werte setzen
        response.setId(application.getId());
        response.setCompanyName(application.getCompanyName());
        response.setPosition(application.getPosition());
        response.setStatus(application.getAppStatus().name()); //Mapper macht Enum -> String
        response.setNotes(application.getNotes());
        response.setAppliedDate(application.getAppliedDate());

        return response;
    }
}
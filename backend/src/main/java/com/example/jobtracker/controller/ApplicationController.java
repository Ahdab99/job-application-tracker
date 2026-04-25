package com.example.jobtracker.controller;

import com.example.jobtracker.dto.ApiResponse;
import com.example.jobtracker.dto.JobAppRequest;
import com.example.jobtracker.dto.JobAppResponse;
import com.example.jobtracker.service.ApplicationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public JobAppResponse createApplication(@RequestBody JobAppRequest request, Authentication authentication) {
        String email = authentication.getName();
        return applicationService.createApplication(request, email);
    }

    @GetMapping
    public List<JobAppResponse> listApplications(Authentication authentication) {
        String email = authentication.getName();
        return applicationService.listApplications(email);
    }

    @PutMapping("/{id}")
    public JobAppResponse updateApplication(@PathVariable Long id,
                                            @RequestBody JobAppRequest request,
                                            Authentication authentication) {
        String email = authentication.getName();
        return applicationService.updateApplication(id, request, email);
    }

    @DeleteMapping("/{id}")
    public ApiResponse deleteApplication(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        applicationService.deleteApplication(id, email);
        return new ApiResponse("Application deleted successfully");
    }
}
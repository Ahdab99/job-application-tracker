package com.example.jobtracker.service;

import com.example.jobtracker.dto.JobAppRequest;
import com.example.jobtracker.dto.JobAppResponse;
import com.example.jobtracker.entity.Application;
import com.example.jobtracker.entity.Status;
import com.example.jobtracker.entity.User;
import com.example.jobtracker.exception.ApplicationNotFoundException;
import com.example.jobtracker.mapper.ApplicationMapper;
import com.example.jobtracker.repository.ApplicationRepository;
import com.example.jobtracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.jobtracker.exception.UnauthorizedActionException;
import com.example.jobtracker.exception.UserNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public JobAppResponse createApplication(JobAppRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        Application application = new Application();
        application.setUser(user);
        application.setCompanyName(request.getCompanyName());
        application.setPosition(request.getPosition());
        application.setAppStatus(Status.valueOf(request.getStatus().toUpperCase()));
        application.setNotes(request.getNotes());
        application.setAppliedDate(request.getAppliedDate());

        Application savedApplication = applicationRepository.save(application);
        return ApplicationMapper.toResponse(savedApplication);
    }

    public JobAppResponse updateApplication(Long id, JobAppRequest request, String email) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found with id: " + id));

        if (!application.getUser().getEmail().equals(email)) {
            throw new UnauthorizedActionException("You are not allowed to update this application");
        }

        application.setCompanyName(request.getCompanyName());
        application.setPosition(request.getPosition());
        application.setAppStatus(Status.valueOf(request.getStatus().toUpperCase()));
        application.setNotes(request.getNotes());
        application.setAppliedDate(request.getAppliedDate());

        Application updatedApplication = applicationRepository.save(application);
        return ApplicationMapper.toResponse(updatedApplication);
    }

    public void deleteApplication(Long id, String email) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found with id: " + id));

        if (!application.getUser().getEmail().equals(email)) {
            throw new UnauthorizedActionException("You are not allowed to delete this application");
        }

        applicationRepository.delete(application);
    }

    public List<JobAppResponse> listApplications(String email) {
        return applicationRepository.findAll()
                .stream()
                .filter(application -> application.getUser().getEmail().equals(email))
                .map(ApplicationMapper::toResponse)
                .collect(Collectors.toList());
    }
}
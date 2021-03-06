package com.internship.epayment.serviceImpl;

import com.internship.epayment.entity.RoleAuthority;
import com.internship.epayment.repository.RoleAuthorityRepository;
import com.internship.epayment.service.RoleAuthorityService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoleAuthorityServiceImpl implements RoleAuthorityService {

    @Autowired
    private RoleAuthorityRepository roleAuthorityRepository;

    @Override
    public List<RoleAuthority> getAll() {
        List<RoleAuthority> list = new ArrayList<>();
        roleAuthorityRepository.findAll().forEach(list::add);
        return list;
    }

    @Override
    public RoleAuthority findById(Long id) throws NotFoundException {
        return roleAuthorityRepository.findById(id).orElseThrow(() -> new NotFoundException("Nu exista!"));
    }

    @Transactional
    public RoleAuthority addRoleAuthority(RoleAuthority roleAuthority) {
        return roleAuthorityRepository.save(roleAuthority);
    }

    @Override
    @Transactional
    public RoleAuthority updateRoleAuthority(RoleAuthority role) {
        return roleAuthorityRepository.save(role);
    }


    @Override
    @Transactional
    public void deleteRoleAuthority(RoleAuthority role) {
        roleAuthorityRepository.delete(role);
    }
}

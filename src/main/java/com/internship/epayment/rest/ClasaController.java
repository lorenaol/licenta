package com.internship.epayment.rest;

import com.internship.epayment.entity.Anunt;
import com.internship.epayment.entity.Clasa;
import com.internship.epayment.service.AnuntService;
import com.internship.epayment.service.ClasaService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/clase")
public class ClasaController {

    @Autowired
    private ClasaService clasaService;

    @GetMapping
    public List<Clasa> getClase() {
        return clasaService.getAll();
    }

    @GetMapping(path = "/{userName}")
    public List<Clasa> getClasaById(@PathVariable String userName) throws NotFoundException {
        return clasaService.findById(userName);
    }

    @PostMapping
    public Clasa addClasa(@RequestBody Clasa clasa) {
        Clasa c = null;
        if (clasa != null) {
            c = clasaService.addClasa(clasa);
        }
        return c;
    }

    @PutMapping
    @ResponseBody
    public Clasa updateClasa(@RequestBody Clasa clasa) {
        return clasaService.updateClasa(clasa);
    }

    @DeleteMapping
    public void deleteClasa(@RequestBody Clasa clasa) {
        clasaService.deleteClasa(clasa);
    }
}

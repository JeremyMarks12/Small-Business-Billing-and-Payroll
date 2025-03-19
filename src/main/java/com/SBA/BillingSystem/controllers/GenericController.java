package com.SBA.BillingSystem.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SBA.BillingSystem.services.GenericService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/{entity}")
public class GenericController<T, ID> {

	private final GenericService<T, ID> service;

	public GenericController(@Qualifier("workerService") GenericService<T, ID> service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<T> save(@RequestBody T entity) {
		return ResponseEntity.ok(service.save(entity));
	}

	@GetMapping
	public ResponseEntity<List<T>> findAll() {
		return ResponseEntity.ok(service.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<T> findById(@PathVariable ID id) {
		Optional<T> entity = service.findById(id);
		return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable ID id) {
		service.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
}

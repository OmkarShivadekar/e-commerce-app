package com.ecom.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecom.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{

}

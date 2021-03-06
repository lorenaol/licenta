package com.internship.epayment.repository;

import com.internship.epayment.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findProductsByCode(String code);

    Product findProductsBySku(String sku);

    Page<Product> findById(Long id, Pageable pageable);

    Page<Product> findByCode(String code, Pageable pageable);

    Page<Product> findByName(String name, Pageable pageable);

    Page<Product> findBySku(String sku, Pageable pageable);

    Page<Product> findBySkuAndCode(String sku, String code, Pageable pageable);

    @Query("select p from Product p where p.name like %:name% and p.sku=:sku")
    Page<Product> findBySkuAndName(String sku, String name, Pageable pageable);

    @Query("select p from Product p where p.name like %:name% and p.code=:code")
    Page<Product> findByNameAndCode(String name, String code, Pageable pageable);

    @Query("select p from Product p where p.name like %:name% and p.code=:code and p.sku=:sku")
    Page<Product> findBySkuAndNameAndCode(String sku, String name, String code, Pageable pageable);

    Page<Product> findBySkuAndCodeAndIdAndName(String sku, String code, Long id, String name, Pageable pageable);

    @Query("select p from Product p where p.name like %:name%")
    Page<Product> findProductsByName(String name, Pageable pageable);

    @Query("select p from Product p where trunc(p.createdDate) = trunc(sysdate)")
    List<Product> findProductsByDateToday();

    @Query("select p from Product p where trunc(p.createdDate) <= trunc(sysdate) and trunc(p.createdDate) >= trunc(sysdate-5)")
    List<Product> findProductsByDateWeek();
    
    @Query("select p from Product p where trunc(p.createdDate) <= trunc(sysdate) and trunc(p.createdDate) >= trunc(sysdate-31)")
    List<Product> findProductsByDateMonth();
}

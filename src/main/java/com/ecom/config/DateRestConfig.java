package com.ecom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.ecom.entity.Product;
import com.ecom.entity.ProductCategory;


@Configuration
public class DateRestConfig implements RepositoryRestConfigurer{

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		
		HttpMethod[] unsupportedMethods = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};
		
		//disable methods for Product: PUT, POST, DELETE
		config.getExposureConfiguration()
				.forDomainType(Product.class)
				.withItemExposure((metadata,httpMethods) -> httpMethods.disable(unsupportedMethods))
				.withCollectionExposure((metadata,httpMethods) -> httpMethods.disable(unsupportedMethods));
		
		//disable methods for ProductCategory: PUT, POST, DELETE
		config.getExposureConfiguration()
				.forDomainType(ProductCategory.class)
				.withItemExposure((metadata,httpMethods) -> httpMethods.disable(unsupportedMethods))
				.withCollectionExposure((metadata,httpMethods) -> httpMethods.disable(unsupportedMethods));
				
				
	}

	
	
}

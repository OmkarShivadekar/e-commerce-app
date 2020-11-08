package com.ecom.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.ecom.entity.Product;
import com.ecom.entity.ProductCategory;


@Configuration
public class DateRestConfig implements RepositoryRestConfigurer{

	private EntityManager entityManager;
	
	@Autowired
	public DateRestConfig(EntityManager theEntityManager) {
		entityManager = theEntityManager;
	}
	
	
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
				
		//call an internal helper method
		exposeIds(config);
		
	}


	private void exposeIds(RepositoryRestConfiguration config) {
		
		//get a list of all entity classes from the entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		//create an array of the entity types
		List<Class> entityClasses = new ArrayList<>();
		
		//get the entity types for the entities
		for(EntityType tempEntityType : entities) {
			entityClasses.add(tempEntityType.getJavaType());
		}
		
		//expose the entity ids for the array of entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}

	
	
}

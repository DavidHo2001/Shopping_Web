package com.shopping.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.util.Date;

@Entity
@Table(name = "user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = true, length = 255)
    private String address;

    @Column(nullable = true, length = 50)
    private String city;

    @Column(nullable = true, length = 10)
    private String zip;

    @Column(nullable = true, length = 50)
    private String country;

    @Column(nullable = true)
    private Date birth_date;

    @Column(nullable = true, length = 10)
    private String sex;

    //Getters and Setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}
    public String getAddress() {return address;}
    public void setAddress(String address) {this.address = address;}
    public String getCity() {return city;}
    public void setCity(String city) {this.city = city;}
    public String getZip() {return zip;}
    public void setZip(String zip) {this.zip = zip;}
    public String getCountry() {return country;}
    public void setCountry(String country) {this.country = country;}
    public Date getBirth_date() {return birth_date;}
    public void setBirth_date(Date birth_date) {this.birth_date = birth_date;}
    public String getSex() {return sex;}
    public void setSex(String sex) {this.sex = sex;}
}
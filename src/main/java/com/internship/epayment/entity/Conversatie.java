package com.internship.epayment.entity;

import javax.persistence.*;

@Entity
@Table(name = "conversatie")
public class Conversatie {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "conversatie_seq")
    @SequenceGenerator(name = "conversatie_seq", allocationSize = 1)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user1_id", referencedColumnName = "id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", referencedColumnName = "id", nullable = false)
    private User user2;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }
}

package com.gen_4.wildledger.auth.models;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.gen_4.wildledger.sightings.models.Individual;
import com.gen_4.wildledger.sightings.models.Sighting;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString(exclude = {"roles", "sightings"})
@EqualsAndHashCode(of = "id")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false, unique = true)
	private String username;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false, updatable = false)
	private Timestamp registerDate;

	private Timestamp lastLogin;

	@Column(nullable = false)
	private boolean isBanned;

	@Column(nullable = false)
	private boolean isEnabled;

    private Timestamp updatedAt;

	@ManyToMany(fetch = FetchType.EAGER)
	private List<Role> roles;

	@OneToMany(mappedBy = "reporter")
	private List<Sighting> sightings;

	@OneToMany(mappedBy = "reporter")
	private List<Individual> individuals;

	public boolean isAccountNonExpired() {
		return true;
	}

	public boolean isAccountNonLocked() {
		return !isBanned;
	}

	public boolean isCredentialsNonExpired() {
		return true;
	}

	public boolean isEnabled() {
		return isEnabled;
	}

    @PrePersist
    protected void onCreate() {
        registerDate = Timestamp.valueOf(LocalDateTime.now());
        updatedAt = Timestamp.valueOf(LocalDateTime.now());
		this.isBanned = false;
		this.isEnabled = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Timestamp.valueOf(LocalDateTime.now());
    }

	public boolean hasRole(RoleOptions roleOptions) {
		for (Role role : roles) {
			if (role.getRole().equals(roleOptions)) {
				return true;
			}
		}

		return false;
	}

}

package dto;

import java.util.List;

public class GroupDTO {
    private Long id;
    private String name;
    private List<UserDTO> members;

    public GroupDTO() {
    }

    public GroupDTO(Long id, String name, List<UserDTO> members) {
        this.id = id;
        this.name = name;
        this.members = members;
    }

    //getters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UserDTO> getMembers() {
        return members;
    }

    public void setMembers(List<UserDTO> members) {
        this.members = members;
    }
}

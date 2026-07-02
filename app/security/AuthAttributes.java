package security;

import models.User;
import play.libs.typedmap.TypedKey;

public class AuthAttributes {

    public static final TypedKey<User> USER =
            TypedKey.create("authenticatedUser");

}
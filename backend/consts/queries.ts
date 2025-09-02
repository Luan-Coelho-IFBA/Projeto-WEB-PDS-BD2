import { LEITOR } from './roles';

export const USER_STORED_PROCEDURE =
  /* sql */
  `CREATE OR REPLACE PROCEDURE create_user(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_hashedPassword VARCHAR(255),
    INOUT p_result JSON DEFAULT NULL
  )
  LANGUAGE plpgsql
  AS $$
  DECLARE
    v_role_id INTEGER;
    v_user_id INTEGER;
    v_email_exists BOOLEAN;
    v_user_data JSON;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM "Users" WHERE email = p_email
    ) INTO v_email_exists;
  
    IF v_email_exists THEN
      RAISE EXCEPTION 'Email já registrado: %', p_email;
    END IF;
  
    SELECT id INTO v_role_id 
    FROM "Roles" 
    WHERE name = '${LEITOR}';
  
    INSERT INTO "Users" (
      name, 
      email, 
      "hashedPassword", 
      "roleId", 
      "isVerified", 
      "createdAt", 
      "updatedAt"
    )
    VALUES (
      p_name,
      p_email,
      p_hashedPassword,
      v_role_id,
      FALSE,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_user_id;

    SELECT JSON_BUILD_OBJECT(
      'user', u.*,
      'role', ROW_TO_JSON(r.*)
    ) INTO v_user_data
    FROM "Users" u
    LEFT JOIN "Roles" r ON u."roleId" = r.id
    WHERE u.id = v_user_id;

    p_result := v_user_data;
  END;
  $$`;

export const USER_VIEW =
  /* sql */
  `CREATE OR REPLACE VIEW "ShowUsers" AS
  SELECT id, "name", "email" FROM "Users"`;

export const LIKE_TRIGGER =
  /* sql */
  `CREATE OR REPLACE FUNCTION update_comment_likes_count()
  RETURNS TRIGGER AS $$
  BEGIN
      IF TG_OP = 'INSERT' THEN
          UPDATE "Comments" 
          SET "likesCount" = COALESCE("likesCount", 0) + 1
          WHERE id = NEW."commentId";
      ELSIF TG_OP = 'DELETE' THEN
          UPDATE "Comments" 
          SET "likesCount" = COALESCE("likesCount", 0) - 1
          WHERE id = OLD."commentId";
      END IF;
      RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;
  CREATE OR REPLACE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON "Likes"
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count()`;

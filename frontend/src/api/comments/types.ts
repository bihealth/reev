/** Allowed values for comment types. */
export type CommentType = 'seqvar' | 'strucvar' | 'gene'

/** Interface for comments as returned by the API. */
export interface Comment$Api {
  /** The ID of the comment itself, only set when fetching. */
  id?: string
  /** The owner of the comment, only set when fetching. */
  user?: string
  /** Type of the comment. */
  obj_type: string
  /** The commented object identifier. */
  obj_id: string
  /** Whether the comment is public. */
  public?: boolean
  /** The comment text. */
  text: string
}

/** Interface for comments. */
export interface Comment {
  /** The ID of the comment itself. */
  id?: string
  /** The owner of the comment. */
  user?: string
  /** Type of the comment. */
  objType: CommentType
  /** The commented object identifier. */
  objId: string
  /** Whether the comment is public. */
  public: boolean
  /** The comment text. */
  text: string
}

/** Helper type for converting between `Comment$Api` and `Comment`. */
class Comment$Type {
  fromJson(api: Comment$Api): Comment {
    return {
      id: api.id,
      user: api.user,
      objType: api.obj_type as CommentType,
      objId: api.obj_id,
      public: api.public ?? false,
      text: api.text
    }
  }

  toJson(comment: Comment): Comment$Api {
    return {
      id: comment.id,
      user: comment.user,
      obj_type: comment.objType,
      obj_id: comment.objId,
      public: comment.public,
      text: comment.text
    }
  }
}

/** Helper instance for converting between `Comment$Api` and `Comment`. */
export const Comment = new Comment$Type()

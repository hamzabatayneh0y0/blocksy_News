


export interface RegisterUserDto {
    username: string;
    email: string;
    password: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UpdateUserDto {
    name: string;
}

export interface CreateCommentDto {
   
    text: string;
    articleId: number;
    parentId:number|null
    rootId:number|null
    
}

export interface UpdateCommentDto {
    text: string;
}
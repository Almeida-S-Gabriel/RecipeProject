
export type Cover = {
  id: number,
  url :string,
}

export type RecipeCard = {
  id:number,
  title: string,
  description: string,  
  serving: number,
  cover : Cover,
  

}

export type Ingredientes = {
  quantity:string,
  name:string,
}

export type Descricao = {
  name : string;
}


export type Recipe = {
  id:number,
  time : string,
  dificulty: string,
  ingredients: Ingredientes[];  // Agora os ingredientes têm nome e quantidade
  descrição: Descricao[]
  RecipeCard: RecipeCard,


}

export interface ApplicationError {
  error: {
    name: string,
    message: string,
  }
}

export type User = {
  id: number,
  username: string,
  email: string,
  role:Role,
  confirmed:string,
  blocked:string

}

export type Role = {
  name: string
}


export type Comment = {
  id: number,
  comment:string,
  date: Date,
  userName:string,
}

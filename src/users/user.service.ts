import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel:Model<User>){}

    async createUser(username: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new this.userModel({username,email,password: hashedPassword})
        return newUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().select("-password").exec();
    } 

    async findUserByEmail(email:string): Promise<User | null> {
        return this.userModel.findOne({email}).exec();
    }

    async findUserById(id: string): Promise<User | null> {
        const user = await this.userModel
            .findById(id)
            .select('username email isBlocked contents') // Sélectionner seulement les champs nécessaires
            .populate('contents', '_id') // Récupérer seulement l'id des contenus associés
            .exec();

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        return user;
    }

    async updateUser(id: string, updateData: User) {
        const user = await this.userModel.findByIdAndUpdate(id, updateData, {new:true}).select("-password");
        if(!user) throw new NotFoundException("Utilisateur Non Trouvé!!!")
        return user;
    }

    async deleteUser(id: string) {
        const result = await this.userModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Utilisateur Non Trouvé!!!")
        return {message: "Utilisateur supprimé avec succès"}
    }

    async blockUser(id: string) {
        const user = await this.userModel.findByIdAndUpdate(id, {isBlocked: true}, {new:true})
        .select('-password');
        if(!user) throw new NotFoundException("Utilisateur Non Trouvé!!!");
        return {message: "Utilisateur bloqué avec succès", user};
    }

    async unblockUser(id: string) {
        const user = await this.userModel.findByIdAndUpdate(id, {isBlocked: false}, {new:true})
        .select('-password');
        if(!user) throw new NotFoundException("Utilisateur Non Trouvé!!!");
        return {message: "Utilisateur restauré avec succès", user};
    }
}
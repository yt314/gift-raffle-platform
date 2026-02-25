export class prizeModel {
    public id!: number;
    public name!: string;
    public description!: string;
    public donorId!: number;
    public ticketPrice!: number;
    public categoryId!: number;
    public imagePath!: string;
    public isRaffleDone: boolean = false;
    public winnerUserId?: number;
}
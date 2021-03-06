import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './schemas/comment.model';
import {
	CreateCommentInput,
	UpdateCommentInput,
} from './schemas/comment.types';

@Injectable()
export class CommentsService {
	constructor(@InjectModel(Comment) private comment: typeof Comment) {}

	async findAll() {
		const comments = await this.comment.findAll();
		return comments;
	}

	async findOne(id: number) {
		const comment = await this.comment.findOne({
			where: {
				id,
			},
		});
		return comment;
	}

	async create(data: CreateCommentInput) {
		return await this.comment.create({ ...data });
	}

	async update(id: number, data: UpdateCommentInput) {
		const comment = await this.findOne(id);
		if (!comment) {
			return null;
		}
		return await comment.update(data);
	}

	async remove(id: number) {
		const comment = await this.findOne(id);
		if (!comment) {
			return null;
		}
		await comment.destroy();
		return comment;
	}
}

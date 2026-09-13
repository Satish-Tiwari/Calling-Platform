import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async saveMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const msg = this.messageRepository.create({
      senderId,
      receiverId,
      content,
      isRead: false,
    });
    return this.messageRepository.save(msg);
  }

  async getConversation(user1Id: string, user2Id: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
      take: 100,
    });
  }

  async markAsRead(user1Id: string, user2Id: string) {
    await this.messageRepository.update(
      { senderId: user2Id, receiverId: user1Id, isRead: false },
      { isRead: true },
    );
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const msg = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!msg) return false;
    if (msg.senderId === userId || msg.receiverId === userId) {
      await this.messageRepository.delete(messageId);
      return true;
    }
    return false;
  }

  async clearConversation(user1Id: string, user2Id: string): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where(
        '(senderId = :user1Id AND receiverId = :user2Id) OR (senderId = :user2Id AND receiverId = :user1Id)',
        { user1Id, user2Id },
      )
      .execute();
  }
}

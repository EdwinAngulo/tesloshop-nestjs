import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectClients {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');

    this.checkClientIsConnected(user);

    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  private checkClientIsConnected(user: User) {
    for (const client of Object.values(this.connectedClients)) {
      if (client.user.id === user.id) {
        client.socket.disconnect();
        break;
      }
    }
  }
}

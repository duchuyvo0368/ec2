import {
     WebSocketGateway,
     WebSocketServer,
     SubscribeMessage,
     MessageBody,
     ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
     cors: { origin: 'http://localhost:3000' },
})
export class CommentGateway {
     @WebSocketServer()
     server: Server;

     @SubscribeMessage('joinPost')
     handleJoinPost(@MessageBody() postId: string, @ConnectedSocket() client: Socket) {
          client.join(postId);
          console.log(`Client ${client.id} joined post ${postId}`);
     }

     @SubscribeMessage('leavePost')
     handleLeavePost(@MessageBody() postId: string, @ConnectedSocket() client: Socket) {
          client.leave(postId);
          console.log(`Client ${client.id} left post ${postId}`);
     }

     @SubscribeMessage('typing')
     handleTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
          // data = { postId, user }
          client.to(data.postId).emit('userTyping', data.user);
     }

     @SubscribeMessage('stopTyping')
     handleStopTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
          // data = { postId, user }
          client.to(data.postId).emit('userStopTyping', data.user);
     }

     sendNewComment(postId: string, comment: any) {
          this.server.to(postId).emit('newComment', comment);
     }

     sendCommentLoading(postId: string, tempComment: any) {
          this.server.to(postId).emit('commentLoading', tempComment);
     }

     sendCommentSaved(postId: string, tempId: string, savedComment: any) {
          this.server.to(postId).emit('commentSaved', { tempId, savedComment });
     }

     sendCommentError(postId: string, tempId: string, error: any) {
          this.server.to(postId).emit('commentError', { tempId, error });
     }
}

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>

#include "stringEncoder.h"

typedef struct
{
	int sock;
	struct sockaddr address;
	socklen_t addr_len;
} connection_t; //struct for the connection

void * process(void * ptr)
{
    
    //process the request by the client.
	char * buffer; //buffer for the client message. 
        char * buffer2; //buffer2 for the encoded string generated by the client
        char * encoder; // encoder for storing the server's local encoded string for compare with client's 
	int len;
        int buffer_length; // length of the buffer 
        int result; // variable to store the response of the matchup between server and client side encoded string
        int salt; 
        char res[1];

	connection_t * conn; //this is the connection instance
	long addr = 0;

	if (!ptr) pthread_exit(0); 
	conn = (connection_t *)ptr;

	/* read length of message */
	read(conn->sock, &len, sizeof(int)); 
        
	if (len > 0)
	{
		addr = (long)((struct sockaddr_in *)&conn->address)->sin_addr.s_addr;
		buffer = (char *)malloc((len+1)*sizeof(char));
		buffer[len] = 0;

		/* read message */
		read(conn->sock, buffer, len);
                //read the length of the salt generated by the client side. 
                read(conn->sock, &salt, sizeof(int));
                
                // If salt is not null
                if(salt>0){
                    
                    // allocate the size of the buffer for storing the salt
                buffer2 = (char *) malloc((salt+1)*sizeof(char));
		buffer2[salt] = 0;
                read(conn->sock, buffer2, salt);
                //buffer2 is the key 
                }
                
                
        unsigned char digest[SHA_DIGEST_LENGTH];
        char* string = buffer;
        // the string to hold the message and generating the string.  
        SHA1((unsigned char*)&string, strlen(string), (unsigned char*)&digest);    
        //mdstring is again getting the generated hash
        char mdString[SHA_DIGEST_LENGTH*2+1];
 
        for(int i = 0; i < SHA_DIGEST_LENGTH; i++){
            sprintf(&mdString[i*2], "%02x", (unsigned int)digest[i]);}
 
        // encode the hash
        encoder=stringToEncodedAscii(mdString);
        //compare the local copy stored in encoder with the received value stored in client's copy
        result=strcmp(buffer2,encoder);
// if true send 0 else send 1 
        if(result==0){
                        res[0]='0';
        }
        else{
                        res[0]='1';
        }        
          
                
                
                //do the encoding and compare here
                
                
                write(conn->sock, res, sizeof(res) );
                                      
                
//		/* print message */
//		printf("%d.%d.%d.%d: %s\n",
//			(int)((addr      ) & 0xff),
//			(int)((addr >>  8) & 0xff),
//			(int)((addr >> 16) & 0xff),
//			(int)((addr >> 24) & 0xff),
//			buffer);
                
                
		free(buffer);
                free(buffer2);

                
	}

	/* close socket and clean up */
	close(conn->sock);
	free(conn);
	pthread_exit(0);
}

int main(int argc, char ** argv)
{
	int sock = -1;
	struct sockaddr_in address;
	int port;
	connection_t * connection;
	pthread_t thread;

	/* check for command line arguments */
	if (argc != 2)
	{
		fprintf(stderr, "usage: %s port\n", argv[0]);
		return -1;
	}

	/* obtain port number */
	if (sscanf(argv[1], "%d", &port) <= 0)
	{
		fprintf(stderr, "%s: error: wrong parameter: port\n", argv[0]);
		return -2;
	}

	/* create socket */
	sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (sock <= 0)
	{
		fprintf(stderr, "%s: error: cannot create socket\n", argv[0]);
		return -3;
	}

	/* bind socket to port */
	address.sin_family = AF_INET;
	address.sin_addr.s_addr = INADDR_ANY;
	address.sin_port = htons(port);
	if (bind(sock, (struct sockaddr *)&address, sizeof(struct sockaddr_in)) < 0)
	{
		fprintf(stderr, "%s: error: cannot bind socket to port %d\n", argv[0], port);
		return -4;
	}

	/* listen on port */
	if (listen(sock, 5) < 0)
	{
		fprintf(stderr, "%s: error: cannot listen on port\n", argv[0]);
		return -5;
	}

	printf("%s: ready and listening\n", argv[0]);
	
	while (1)
	{
		/* accept incoming connections */
		connection = (connection_t *)malloc(sizeof(connection_t));
		connection->sock = accept(sock, &connection->address, &connection->addr_len);
		if (connection->sock <= 0)
		{
			free(connection);
		}
		else
		{
			/* start a new thread but do not wait for it */
			pthread_create(&thread, 0, process, (void *)connection);
			pthread_detach(thread);
		}
	}
	
	return 0;
}
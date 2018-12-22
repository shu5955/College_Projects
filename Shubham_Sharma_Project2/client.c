#include <stdio.h>
#include <sys/socket.h>
#include <netdb.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include "stringEncoder.h"// This is the header file import for the helper method present in the stringEncoderfile.
int main(int argc, char ** argv)
{
	int port; //port number
	int sock = -1;
	struct sockaddr_in address; //socket address
	struct hostent * host; //hostname
	int len,salt; //length of the message and salt is the length of the hash that I am generating later. 
	 char * encoder;
	/* checking commandline parameter */
	if (argc != 4)
	{
		printf("usage: %s hostname port text\n", argv[0]);
		return -1;
	}

	/* obtain port number */
	if (sscanf(argv[2], "%d", &port) <= 0)
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

	/* connect to server */
	address.sin_family = AF_INET;
	address.sin_port = htons(port);
	host = gethostbyname(argv[1]);
	if (!host)
	{
		fprintf(stderr, "%s: error: unknown host %s\n", argv[0], argv[1]);
		return -4;
	}
	memcpy(&address.sin_addr, host->h_addr_list[0], host->h_length);
	if (connect(sock, (struct sockaddr *)&address, sizeof(address)))
	{
		fprintf(stderr, "%s: error: cannot connect to host %s\n", argv[0], argv[1]);
		return -5;
	}

	/* send text to server */
	len = strlen(argv[3]); //writing the length first and making buffer for the message on the server side
	write(sock, &len, sizeof(int)); 
        write(sock, argv[3], len);// writing the message 
        
        
        //the followings is the method to generate  hash string
        unsigned char digest[SHA_DIGEST_LENGTH];
        char* string = argv[3];
    // invoke openssl sha method
        SHA1((unsigned char*)&string, strlen(string), (unsigned char*)&digest);    
 
        char mdString[SHA_DIGEST_LENGTH*2+1];
 
        for(int i = 0; i < SHA_DIGEST_LENGTH; i++){
            sprintf(&mdString[i*2], "%02x", (unsigned int)digest[i]);}
 //mdstring is the generated hash
//encode the hash using the encoder. 
        encoder=stringToEncodedAscii(mdString);
        
        //get the length of encoded string
        
        salt = strlen(encoder);
//write the length of the salt first and send the encoded string to the server. 
        write(sock, &salt, sizeof(int));
	write(sock, encoder, salt);//replace hello with encoded string

      
        //read the response and client produces output. 
        char res[1];
        
        read(sock, res, 1);
        //if the response from server is 0 write true else false. 
        if(atoi(res) == '0'){
            printf("true\n");
        }else{
            printf("false\n");
        }
	/* close socket */
	close(sock);

	return 0;
}
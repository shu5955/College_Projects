#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <signal.h>
#include <limits.h>
#include <errno.h>


#define HISTORYLENGTH 10 //the number of history commands stored in the list 

static char * history[HISTORYLENGTH]; //pointer to the history array
static int history_count = 0;// the initial history count is set to 0


// addd the values to the history array. 
static void add(const char * line){
        int limit=HISTORYLENGTH-1;
        
	if(history_count == limit){ // checks for the limit 
		int i;
		free(history[0]); // If the limit is reached then free the first element from the history. 
                
		for(i=1; i < history_count; i++)
                        history[i-1] = history[i];
		history_count--;
	}
        
	history[history_count++] = strdup(line); // add to the history if the limit is not reached. 
}



// function to receive and process commands from the user
static void execute(const char * line)
{
    	char * line_copy = strdup(line);
        char * parameters[10];
    	int counter = 0;
        int background = 0;
	pid_t pid = fork();	// create a new process
       
    	parameters[counter++] = strtok(line_copy, " "); // seprate the line tokens into the parameter array

        while(parameters[counter-1] != NULL){	// as long as we have a token. 
		parameters[counter++] = strtok(NULL, " ");
            }
        
        counter--; 
        
        // check to see if the child needs to work in background or not 
	if(strcmp(parameters[counter-1], "&") == 0){
		background = 1; // set to work on the background
		parameters[--counter] = NULL;	
	}
        
        
        
        if(background){
        // needs not to wait 
                   if(pid == 0){
                   //child
                       execvp(parameters[0], parameters);
                   }
                   else if (pid == -1){
                   //error
                       perror("fork failed");
                   }
                   else{
                   //parent
                        printf("\n");
                   }
        }
        else{
        // needs to wait
                   if(pid == 0){
                  //child
                         execvp(parameters[0], parameters);
                         for(int j=0;j<counter;j++)
                                          { parameters[j] = NULL;} 
                   }
                   else if (pid == -1){
                   //error
                       perror("fork failed");
                   }
                   else{
                   //parent
                            wait(NULL);
                    }
        }
}



// The main driving function

int main(int argc, char *argv[]){
    
    
    //Allocate the space using malloc
    size_t size = 100;
    char *line = (char *) malloc(sizeof(char) * size);
    
    int length =0;
    int row_fetch = 0; 
    
    // infinite loop 
    for(;;){
                if(!row_fetch)
			printf("OSH > ");
                fflush(stdout);
                int get_line=getline(&line, &size, stdin); // call getline to read the user input
                
                if(get_line== -1){	// read line for input
                    
                       if(errno == EINTR){	 // If the error code is errno
				clearerr(stdin); // clear error string
				row_fetch = 1;	 // set flag 1
				continue; // go back to the loop before going down
			}
                
			perror("check get line function");
			break;
		}
               
                
                
                row_fetch=0;
                length = strlen(line); // get the length of the string
                
                if(length==1){
                    continue;
                }
                
		line[length-1] = '\0'; //delete new line
                
                
                if(strcmp(line, "exit") == 0){ //if the entered line is "exit", exit the loop and end the program
			break;
		}
                else if(strcmp(line, "history") == 0){
                   // if the line entered is "history"
                                        int counter=history_count-1;
                                        while(counter >=0)
                                        {// this loop list history array 
                                               
                                                int size=counter+1;
                                                printf("%i %s\n", size , history[counter]);
                                                counter--;
                                        }
		}
                 else if(line[0] == '!' && line[1] == '!')
                {                         //print the most recent command
                                        printf("%s\n", line);	
                                        execute(history[history_count-1]); // the parameter is the most recent command from history
                }
                
                 else if(line[0] == '!'){ // the first character of the entered line is "!" followed by an index
                  
                                        int counter = atoi(&line[1]) - 1; //get the number
                                        if((counter < 0) || (counter > history_count)){ // check for bounds
                                            fprintf(stderr, "No such command in history.\n");
                                        }
                                        printf("%s\n", line);	//print the line 
                                        execute(history[counter]); // pass the correct command to execute the command
    		}
                else{ // if you do not enter the above situations
                                        add(line); // call the add function to append to the entered line history
                                        execute(line); // call the execute function to get a new line
		}
    }
    
    
        free(line); // free the memory
	return 0;
}

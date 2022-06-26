//Styling
import {NativeBaseProvider, Box, Center, 
        ScrollView, Text, VStack, 
         Input, Icon, Tooltip, Button, Popover} from 'native-base';
import { Ionicons } from "@expo/vector-icons";

import { Image, Pressable } from 'react-native';
//AWS
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import {withAuthenticator, S3Image } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports';
import {listMovies} from './src/graphql/queries';
//React
import React, { useEffect, useState } from 'react';



Amplify.configure(awsconfig);

export default function App() {
  

  //AWS Functions
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []) //Empty array will run effect once
  
  const fetchMovies = async () => {
    try{
      const movieData = await API.graphql(graphqlOperation(listMovies));
      const movieList = movieData.data.listMovies.items;
      console.log('Movie list: \n', movieList);
      setMovies(movieList);
    }catch (e){
      console.log("Error on fetching movies", e);
    }
  }

  //Search
  const [search, setSearch] = useState('');

  const _handleSearch = searchInput => {
    setSearch(searchInput)
  }

  return (

      <NativeBaseProvider >
        <Box bg="gray.900" h="full" safeArea>
          
          {/**Header */}
          <Center _text={{color: "red.700", fontFamily: "Roboto", fontWeight: 700, letterSpacing: 1.3, fontSize: 36}}>
            InterFlix
          </Center>
 
          {/**Search */}
          <Center>
            <VStack w="90%" space={5} alignSelf="center" mb="3">
              <Input type='search' onChangeText={_handleSearch}
                    placeholder="Search" variant="filled" 
                    width="100%" borderRadius="10" py="1" px="2" 
                    borderWidth="2" borderColor="gray.900" bg="gray.800"
                    InputLeftElement={<Icon ml="2" size="4" color="gray.400" 
                    as={<Ionicons name="ios-search" />} />} />
            </VStack>
          </Center>

          {/**Recommended */}
          <Text color="gray.100" fontSize={22} fontWeight={700} left="5" bottom={-15}>{(search == "") ? "For you" : "Search Results"}</Text>
    

          {/**Horizontal Scroll */}
          <ScrollView horizontal={true} maxHeight="1/3" snapToInterval={390} decelerationRate="fast"> 
            {movies.filter((val) => {
                if (search == ""){
                  return val;
                }else if( val.title.toLowerCase().includes(search.toLowerCase()) ){
                  return val;
                }
              }).map((movie, idx) => {
                
                return( 
                    <Box flex={1} m="5" key={movie.id} w={350}
                        _text={{color: "white"}} borderWidth={1} borderColor="gray.800"
                        placement='bottom' label="test" openDelay={400} bg="gray.800"
                        >
                          <Image source={{uri: movie.image}} resizeMode={'cover'} 
                                style={{width: '100%', height:'100%'}} alt={movie.title}/>
                          

                          <Box flex={1} bg="red.700" position="absolute" bottom="3" left="0">
                          
                          <Popover  trigger={triggerProps => { return (
                            <Button variant="unstyled" _text={{color: "white", fontSize: 18, fontWeight: "bold"}} py="0" px="1.5"  {...triggerProps}>
                                {movie.title}              
                            </Button>);}}>
                                <Popover.Content borderColor="gray.900" width={250} mx="2" >
                                  <Popover.CloseButton top="0"/>
                                  <Popover.Header bg="gray.800"_text={{color: 'white', fontSize: 14}} py="1.5">Description</Popover.Header>
                                  <Popover.Body bg="gray.800" _text={{color: 'white', fontSize: 14}} p="3">{movie.description}</Popover.Body>
                                  <Popover.Footer bg="gray.800"  m="0" p="1">{
                                      movie.tags.map((tag,idx) => {
                                        return(<Text color="white" px="1" fontSize={12}>{tag}</Text>);
                                        })}
                                    </Popover.Footer>
                                </Popover.Content>
                            </Popover>
                          </Box>
                    </Box>
                  
                );
              })}
          </ScrollView>
    
        </Box>
      </NativeBaseProvider>
   
  );
}

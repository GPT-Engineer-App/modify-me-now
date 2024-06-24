import { Container, Text, VStack, Heading, Button } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

const Index = () => {
  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl">Welcome to Your New App</Heading>
        <Text fontSize="xl">This is a bare-bones application ready for your modifications.</Text>
        <Button leftIcon={<FaEdit />} colorScheme="teal" size="lg">
          Start Editing
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Felipe Yui</Text>
        <Text color="gray.300" fontSize="small">
          felipe_m87@yahoo.com.br
        </Text>
      </Box>
      <Avatar size="md" name="Felipe Yui" src="/felipe.jfif" />

    </Flex>
  )
}
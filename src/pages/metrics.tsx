import { Flex } from "@chakra-ui/react";

import { Header } from "../components/Header";
import { withSSRAuth } from "../utils/withSSRAuth";
import { setupApiClient } from "../services/api";


export default function Metrics() {



  return (
    <Flex direction="column" h="100vh" >
      <Header />
      <h1>Metrics</h1>

    </Flex>

  )
}
export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx)
  const response = await apiClient.get('/me')



  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
})
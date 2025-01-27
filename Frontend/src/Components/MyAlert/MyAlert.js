function MyAlert(title,status,toast){
    return (
      toast({
          title:title,
          position: 'top',
          status: status,
          duration: 6000,
          isClosable: true,
        })
    )
  }
  export default MyAlert;
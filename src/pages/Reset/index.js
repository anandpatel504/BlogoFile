import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import axios from "axios";
export default function ResetPassword(): JSX.Element {
  const [redirectUrl, setRedirectUrl] = useState("");
  const toast = useToast();
  let { token } = useParams();
  const [isloading, setLoading] = useState(false);
  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const [values, setValues] = useState({
    password: "",
    c_password: "",
  });
  const onForgot = (e) => {
    toast.closeAll();
    e.preventDefault();
    if (values.password == "" && values.c_password == "") {
      toast({
        title: "Invalid Details.",
        description: "Input fields can't be empty.",
        status: "error",
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }
    if (values.password != values.c_password) {
      toast({
        title: "Password did't match.",
        description: "Please enter valid password.",
        status: "error",
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }
    setLoading(true);
    axios
      .patch(process.env.REACT_APP_BACKEND_API_URL + "/reset-password/"+token, {
        password: values.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          toast({
            title: `Hey ${res.data.user.name}`,
            description: `Your password has been changed!`,
            status: "success",
            variant: "left-accent",
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
          });
          setRedirectUrl("/login");
        } else if (res.data.status == "error") {
          setLoading(false);
          toast({
            title: res.data.message,
            status: "error",
            variant: "left-accent",
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
          });
        } else {
          setLoading(false);
          toast({
            title: "Server error..",
            status: "error",
            variant: "left-accent",
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      {redirectUrl !== "" ? <Redirect to={redirectUrl} /> : ""}

      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Enter new password
        </Heading>
        <Box onSubmit={onForgot} as={"form"}>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            New Password.
          </Text>
          <FormControl id="email">
            <Input
              placeholder="Enter new password."
              _placeholder={{ color: "gray.500" }}
              type="pasword"
              name="password"
              value={values.password}
              onChange={changeHandler}
            />
          </FormControl>
          <Text
          mt={5}
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            Confirm Password.
          </Text>
          <FormControl id="email">
            <Input
              placeholder="Confirm your password."
              _placeholder={{ color: "gray.500" }}
              type="c_password"
              name="c_password"
              value={values.c_password}
              onChange={changeHandler}
            />
          </FormControl>
          <Stack spacing={6} pt={5}>
            <Button
              isLoading={isloading}
              loadingText="Sending Email..."
              type="submit"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Request Reset
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

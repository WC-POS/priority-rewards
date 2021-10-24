import React from "react";
import { Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import { UilArrowLeft, UilArrowRight } from "@iconscout/react-unicons";

const paginateButtons = (props) => {
  return (
    <>
      <ButtonGroup isAttached>
        <IconButton
          icon={<UilArrowLeft />}
          colorScheme="blue"
          isDisabled={props.page <= props.maxPage || props.maxPage === 0}
        />
        <Button
          variant="ghost"
          colorScheme="blue"
          isLoading={props.status === "loading"}
        >
          {props.page} / {props.maxPage ? props.maxPage : 1}
        </Button>
        <IconButton
          icon={<UilArrowRight />}
          colorScheme="blue"
          isDisabled={props.page >= props.maxPage}
        />
      </ButtonGroup>
    </>
  );
};

export default paginateButtons;

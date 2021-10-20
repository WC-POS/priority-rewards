import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Button,
  Heading,
  IconButton,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import {
  UilArrowBreak,
  UilBold,
  UilBookAlt,
  UilEye,
  UilImage,
  UilItalic,
  UilLeftIndentAlt,
  UilLink,
  UilListUl,
  UilRightIndentAlt,
  UilTextStrikeThrough,
  UilTimes,
} from "@iconscout/react-unicons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MDEditor = forwardRef((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textArea = useRef();
  const [textState, setTextState] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useImperativeHandle(ref, () => ({
    setValue(val) {
      setTextState(val);
    },
  }));

  useEffect(() => {
    setWordCount(
      textState
        .trim()
        .split(" ")
        .filter((word) => !["#", "##", "###", "---"].includes(word)).length
    );
    if (props.onChange) {
      props.onChange(textState);
    }
  }, [textState]);

  useEffect(() => {
    if (textState.substring(selection.end, selection.end + 1) === "\n") {
      let splitString = textState.substring(0, selection.end).split("\n");
      let prevLine = splitString[splitString.length - 1];
      let modeDecorator = prevLine.trimStart().substring(0, 2);
      let currentLine = textState.substring(selection.end + 1).split("\n")[0];
      if (["> ", "- "].includes(modeDecorator) && currentLine.length === 0) {
        if (prevLine.length > modeDecorator.length) {
          setTextState(
            textState.substring(0, selection.end + 1) +
              modeDecorator +
              textState.substring(selection.end + 1)
          );
          setTimeout(() => {
            textArea.current.selectionStart = selection.end + 3;
            textArea.current.selectionEnd = selection.end + 3;
          }, 1);
        } else {
          setTextState(
            textState.substring(0, selection.end - modeDecorator.length - 1) +
              textState.substring(selection.end)
          );
          setTimeout(() => {
            textArea.current.selectionStart =
              selection.end - modeDecorator.length;
            textArea.current.selectionEnd =
              selection.end - modeDecorator.length;
          }, 1);
        }
      }
    }
  }, [textState]);

  const decorateText = (decorator) => {
    if (document.activeElement === textArea.current) {
      setTextState(
        textState.substring(0, selection.end) +
          decorator +
          textState.substring(selection.end)
      );
      setTimeout(() => {
        textArea.current.selectionStart = selection.end + decorator.length;
        textArea.current.selectionEnd = selection.end + decorator.length;
      }, 1);
    }
  };

  const insertLink = ({ title, link }) => {
    setTextState(
      textState.substring(0, selection.end) +
        `[${title}](${link})` +
        textState.substring(selection.end)
    );
    setTimeout(() => {
      textArea.current.selectionStart = selection.end + 1;
      textArea.current.selectionEnd = selection.end + title.length + 1;
    }, 1);
  };

  const prefixLine = (decorator, toggle = true) => {
    let searchText = textState.substring(0, selection.start).split("\n");
    if (
      searchText[searchText.length - 1].substring(0, decorator.length) ===
        decorator &&
      toggle
    ) {
      searchText[searchText.length - 1] = searchText[
        searchText.length - 1
      ].substring(decorator.length);
      setTextState(
        searchText.join("\n") + textState.substring(selection.start)
      );
      setTimeout(() => {
        textArea.current.selectionStart = selection.start - decorator.length;
        textArea.current.selectionEnd = selection.end - decorator.length;
      }, 1);
    } else {
      searchText[searchText.length - 1] =
        decorator + searchText[searchText.length - 1];
      setTextState(
        searchText.join("\n") + textState.substring(selection.start)
      );
      setTimeout(() => {
        textArea.current.selectionStart = selection.start + decorator.length;
        textArea.current.selectionEnd = selection.end + decorator.length;
      }, 1);
    }
  };

  const removePrefix = (decorator) => {
    let searchText = textState.substring(0, selection.start).split("\n");
    if (
      searchText[searchText.length - 1].substring(0, decorator.length) ===
      decorator
    ) {
      searchText[searchText.length - 1] = searchText[
        searchText.length - 1
      ].substring(decorator.length);
      setTextState(
        searchText.join("\n") + textState.substring(selection.start)
      );
      setTimeout(() => {
        textArea.current.selectionStart = selection.start - decorator.length;
        textArea.current.selectionEnd = selection.end - decorator.length;
      }, 1);
    }
  };

  const wrapText = (decorator) => {
    if (document.activeElement === textArea.current) {
      setTextState(
        textState.substring(0, selection.start) +
          decorator +
          textState.substring(selection.start, selection.end) +
          decorator +
          textState.substring(selection.end)
      );
      setTimeout(() => {
        textArea.current.selectionStart = selection.start + decorator.length;
        textArea.current.selectionEnd = selection.end + decorator.length;
      }, 1);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalCloseButton />
          <Heading size="xl">Preview</Heading>
          <ModalBody py={4} px={0} mt={2}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <Heading {...props} size="xl" />,
                h2: ({ node, ...props }) => <Heading {...props} size="lg" />,
                h3: ({ node, ...props }) => <Heading {...props} size="md" />,
                ul: ({ node, ...props }) => <UnorderedList {...props} />,
                li: ({ node, ...props }) => (
                  <ListItem {...props} ordered={props.ordered.toString()} />
                ),
                a: ({ node, ...props }) => <Link {...props} color="blue.600" />,
                blockquote: ({ node, ...props }) => (
                  <Text
                    {...props}
                    bg="gray.100"
                    p={2}
                    rounded="md"
                    whiteSpace="pre-wrap"
                    borderLeftWidth={6}
                    borderLeftColor="gray.500"
                  />
                ),
                p: ({ node, ...props }) => (
                  <Text {...props} whiteSpace="pre-wrap" />
                ),
                code: ({ node, ...props }) => (
                  <Text {...props} whiteSpace="pre-wrap" />
                ),
                pre: ({ node, ...props }) => (
                  <Text {...props} whiteSpace="pre-wrap" />
                ),
              }}
            >
              {textState}
            </ReactMarkdown>
          </ModalBody>
          <ModalFooter justifyContent="center" w="full" p={0} mt={2}>
            <IconButton
              icon={<UilTimes />}
              w="full"
              onClick={onClose}
              size="sm"
            >
              Close
            </IconButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack
        direction={{ base: "column", md: "row" }}
        bg="white"
        borderWidth={1}
        border="gray.300"
        rounded="md"
        px={4}
        py={2}
        shadow="md"
        spacing={0}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center">
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilBold />}
            variant="ghost"
            onClick={() => wrapText("**")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilItalic />}
            variant="ghost"
            onClick={() => wrapText("*")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilTextStrikeThrough />}
            variant="ghost"
            onClick={() => wrapText("~~")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilArrowBreak />}
            variant="ghost"
            onClick={() => decorateText("\r\n---\r\n")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
        </Stack>
        <Stack direction="row" alignItems="center">
          <Button
            isDisabled={props.isLocked}
            variant="ghost"
            onClick={() => prefixLine("# ")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          >
            H1
          </Button>
          <Button
            isDisabled={props.isLocked}
            variant="ghost"
            onClick={() => prefixLine("## ")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          >
            H2
          </Button>
          <Button
            isDisabled={props.isLocked}
            variant="ghost"
            onClick={() => prefixLine("### ")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          >
            H3
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center">
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilLink />}
            variant="ghost"
            onClick={() =>
              insertLink({ title: "title", link: "https://www.example.com" })
            }
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilBookAlt />}
            variant="ghost"
            onClick={() => prefixLine("> ", false)}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilImage />}
            variant="ghost"
            tabIndex="-1"
          />
        </Stack>
        <Stack direction="row" alignItems="center">
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilLeftIndentAlt />}
            variant="ghost"
            onClick={() => removePrefix("    ")}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilRightIndentAlt />}
            variant="ghost"
            onClick={() => prefixLine("    ", false)}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
          <IconButton
            isDisabled={props.isLocked}
            icon={<UilListUl />}
            variant="ghost"
            onClick={() => prefixLine("- ", false)}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex="-1"
          />
        </Stack>
      </Stack>
      <Textarea
        bg="white"
        h="250px"
        isDisabled={props.isLocked}
        ref={textArea}
        onChange={(e) => setTextState(e.target.value)}
        onSelect={(e) =>
          setSelection({
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
          })
        }
        value={textState}
      />
      <Stack
        mt={4}
        alignItems="center"
        justifyContent="space-between"
        w="full"
        direction="row"
      >
        <Button
          leftIcon={<UilEye />}
          variant="ghost"
          alignItems="center"
          isDisabled={props.isLocked || !textState.trim().length}
          onClick={onOpen}
        >
          Preview
        </Button>

        <Text pr={2}>
          {wordCount} word{wordCount > 1 ? <>s</> : <></>}
        </Text>
      </Stack>
    </>
  );
});

export default MDEditor;

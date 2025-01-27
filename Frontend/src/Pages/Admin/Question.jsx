import { Box, Button, Center, Flex, Select, Stack, Text, useToast, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { postQuestionApi } from '../../api';
import MyAlert from '../../Components/MyAlert/MyAlert';

const init = {
    section: "",
    type: "",
    level: "",
    question: "",
    answer: "",
    option: [],
    tolerance: 0
};

const Question = () => {
    const [form, setForm] = useState(init);
    const [option, setOption] = useState("");
    const toast = useToast();

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const optionHandler = () => {
        if (option.trim() === "") {
            MyAlert("Option cannot be empty", 'error', toast);
            return;
        }
        setForm({
            ...form,
            option: [...form.option, option]
        });
        setOption("");
        MyAlert(`Option Added`, 'success', toast);
    };
    const resetForm = () => {
        const freshInit = {
            section: "",
            type: "",
            level: "",
            question: "",
            image:null,
            answer: "",
            option: [],
            tolerance: 0
        };
        setForm(freshInit);
        setOption("");
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            for (const key in form) {
                if (key === 'option') {
                    form[key].forEach((opt) => formData.append('option[]', opt));
                } else {
                    formData.append(key, form[key]);
                }
            }

            const res = await postQuestionApi(formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            MyAlert(res.data.message, 'success', toast);
            resetForm();
        } catch (error) {
            MyAlert(error.response.data.message, 'error', toast);
        }
    };

    return (
        <Box fontWeight='600' w={['95%', '80%', '50%']} m='20px auto' bg='#fff' p='10px'
            boxShadow='0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
        >
            <Stack>
                <Center>
                    <Text>Add Question For Quiz</Text>
                </Center>
                <Text>Section</Text>
                <Select name='section' onChange={changeHandler} value={form.section}>
                    <option value="">Select Section</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                </Select>

                <Text>Question Type</Text>
                <Select name='type' onChange={changeHandler} value={form.type}>
                    <option value="">Select Type</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="numerical">Integer Answer</option>
                </Select>

                <Text>Question Level</Text>
                <Select name='level' onChange={changeHandler} value={form.level}>
                    <option value="">Select Level</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </Select>

                <Text>Question</Text>
                <textarea
                    name='question'
                    style={{ display: "block", width: '100%', padding: "10px" }}
                    onChange={changeHandler}
                    value={form.question}
                />

                <Text>Upload Image</Text>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setForm({ ...form, image: e.target.files[0] });
                    }}
                />


                <Text>Answer</Text>
                <textarea
                    name='answer'
                    style={{ display: "block", width: '100%', padding: "10px" }}
                    onChange={changeHandler}
                    value={form.answer}
                />

                {form.type === 'numerical' && (
                    <>
                        <Text>Tolerance (±)</Text>
                        <Input
                            name='tolerance'
                            type="number"
                            min="0"
                            onChange={changeHandler}
                            value={form.tolerance}
                        />
                    </>
                )}

                {form.type === 'mcq' && (
                    <>
                        <Text>Options</Text>
                        <textarea
                            style={{ display: "block", width: '100%', padding: "10px" }}
                            onChange={(e) => setOption(e.target.value)}
                            value={option}
                        />
                        <Flex justify='flex-end'>
                            <Button
                                variant='solid'
                                mt='15px'
                                colorScheme='purple'
                                isDisabled={form.option.length === 4}
                                onClick={optionHandler}
                            >
                                Add Option
                            </Button>
                        </Flex>
                    </>
                )}

                <Button variant='solid' mt='5px' colorScheme='purple' onClick={submitHandler}>
                    Submit Question
                </Button>
            </Stack>
        </Box>
    );
}


export default Question
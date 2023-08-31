import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Text, Title, Modal, TextInput, Group, Card, ActionIcon } from '@mantine/core';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';

import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });
  const toggleColorScheme = () =>
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

  useHotkeys([['mod+J', toggleColorScheme]]);

  const taskTitle = useRef();
  const taskSummary = useRef();

  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value || '',
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    saveTasks([...tasks, newTask]);
  }

  function deleteTask(index) {
    const clonedTasks = [...tasks];
    clonedTasks.splice(index, 1);
    setTasks(clonedTasks);
    saveTasks(clonedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem('tasks');
    const parsedTasks = JSON.parse(loadedTasks);
    if (parsedTasks) {
      setTasks(parsedTasks);
    }
  }

  function saveTasks(tasksToSave) {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, defaultRadius: 'md' }} withGlobalStyles withNormalizeCSS>
        <div className='App'>
          <Modal
            opened={opened}
            size={'md'}
            title={'New Task'}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput mt={'md'} ref={taskTitle} placeholder={'Task Title'} required label={'Title'} />
            <TextInput ref={taskSummary} mt={'md'} placeholder={'Task Summary'} label={'Summary'} />
            <Group mt={'md'} position={'apart'}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={'subtle'}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={'apart'}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={'blue'}
                onClick={toggleColorScheme}
                size='lg'
              >
                {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.title) {
                  return (
                    <Card withBorder key={index} mt={'sm'}>
                      <Group position={'apart'}>
                        <Text weight={'bold'}>{task.title}</Text>
                        <ActionIcon
                          onClick={() => {
                            deleteTask(index);
                          }}
                          color={'red'}
                          variant={'transparent'}
                        >
                          <Trash />
                        </ActionIcon>
                      </Group>
                      <Text color={'dimmed'} size={'md'} mt={'sm'}>
                        {task.summary
                          ? task.summary
                          : 'No summary was provided for this task'}
                      </Text>
                    </Card>
                  );
                }
                return null;
              })
            ) : (
              <Text size={'lg'} mt={'md'} color={'dimmed'}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={'md'}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;

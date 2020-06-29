import bcrpyt from "bcryptjs";
import prisma from "../../src/prisma";
import jwt from "jsonwebtoken";

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrpyt.hashSync('Red049!@12'),
  },
  user: undefined,
  jwt: undefined,
};

const userTwo = {
  input: {
    name: 'Tom',
    email: 'tom@ex.com',
    password: bcrpyt.hashSync('P33xcv2323r'),
  },
  user: undefined,
  jwt: undefined,
};

const postOne = {
  input: {
    title: 'My publ posts',
    body: '',
    published: true,
  },
  post: undefined
};

const postTwo = {
  input: {
    title: 'My draft posts',
    body: '',
    published: false,
  },
  post: undefined
};

const commentOne = {
  input: {
    text: 'Great post',
  },
  comment: undefined,
};

const commentTwo = {
  input: {
    text: 'Bad post',
  },
  comment: undefined,
};

const seedDatabase = async () => {
  jest.setTimeout(30000);
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        }
      }
    }
  });
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        }
      }
    }
  });
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.user.id,
        }
      },
      post: {
        connect: {
          id: postOne.post.id,
        }
      }
    }
  });
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        }
      },
      post: {
        connect: {
          id: postOne.post.id,
        }
      }
    }
  });
};

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo };
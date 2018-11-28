/* global afterAll:false, afterEach:false, beforeAll:false, expect:false, test:false */
const fs = require("fs");
const writeToFile = require("../src");

const BASE_DIR = `${__dirname}/fixtures`;

const unlink = path => {
  try {
    fs.unlinkSync(path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const rmdir = path => {
  try {
    fs.rmdirSync(path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const getPermission = path => {
  const stats = fs.statSync(path);

  return (stats.mode & 0o777).toString(8); // eslint-disable-line
};

beforeAll(() => fs.mkdirSync(BASE_DIR));

afterAll(() => fs.rmdirSync(BASE_DIR));

afterEach(() => {
  unlink(`${BASE_DIR}/test.txt`);
  unlink(`${BASE_DIR}/test2.txt`);

  unlink(`${BASE_DIR}/foo/bar/test.txt`);
  rmdir(`${BASE_DIR}/foo/bar`);
  rmdir(`${BASE_DIR}/foo`);
});

test("it can write string data to a file", async () => {
  const file = `${BASE_DIR}/test.txt`;

  expect(fs.existsSync(file)).toBe(false);

  await writeToFile(file, "foo bar");

  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, "utf8")).toBe("foo bar");
});

test("it can write to a file and automatically create its parent directories", async () => {
  const file = `${BASE_DIR}/foo/bar/test.txt`;

  expect(fs.existsSync(file)).toBe(false);

  await writeToFile(file, "foo bar");

  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, "utf8")).toBe("foo bar");
});

test("it can write buffers data to a file", async () => {
  const FILE = `${BASE_DIR}/test.txt`;

  expect(fs.existsSync(FILE)).toBe(false);

  const buff = Buffer.from("foo bar");

  await writeToFile(FILE, buff);

  expect(fs.existsSync(FILE)).toBe(true);
  expect(fs.readFileSync(FILE, "utf8")).toBe("foo bar");
});

test("it can set encoding", async () => {
  // HEX
  const file1 = `${BASE_DIR}/test.txt`;
  expect(fs.existsSync(file1)).toBe(false);

  const buff1 = Buffer.from("foo");
  await writeToFile(file1, buff1.toString("hex"), "hex");

  expect(fs.existsSync(file1)).toBe(true);
  expect(fs.readFileSync(file1, "utf8")).toBe("foo");

  // ASCII
  const file2 = `${BASE_DIR}/test2.txt`;
  expect(fs.existsSync(file2)).toBe(false);

  const buff2 = Buffer.from("foo");
  await writeToFile(file2, buff2.toString("ascii"), "ascii");

  expect(fs.existsSync(file2)).toBe(true);
  expect(fs.readFileSync(file2, "utf8")).toBe("foo");
});

test("it can receive encoding option", async () => {
  const file = `${BASE_DIR}/test.txt`;

  expect(fs.existsSync(file)).toBe(false);

  const buff = Buffer.from("foo");

  await writeToFile(file, buff.toString("hex"), {
    encoding: "hex"
  });

  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, "utf8")).toBe("foo");
});

test("it can receive mode option", async () => {
  // 640
  const file1 = `${BASE_DIR}/test.txt`;
  expect(fs.existsSync(file1)).toBe(false);

  await writeToFile(file1, "foo bar", {
    mode: 0o640
  });

  expect(fs.existsSync(file1)).toBe(true);
  expect(getPermission(file1)).toBe("640");

  // 701
  const file2 = `${BASE_DIR}/test2.txt`;
  expect(fs.existsSync(file2)).toBe(false);

  await writeToFile(file2, "foo bar", {
    mode: 0o701
  });

  expect(fs.existsSync(file2)).toBe(true);
  expect(getPermission(file2)).toBe("701");
});

test("it can receive flag option", async () => {
  const file = `${BASE_DIR}/test.txt`;

  expect(fs.existsSync(file)).toBe(false);

  // Create file with "foo".
  await writeToFile(file, "foo", {
    flag: "w"
  });

  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, "utf8")).toBe("foo");

  // Override file with "bar".
  await writeToFile(file, "bar", {
    flag: "w"
  });

  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, "utf8")).toBe("bar");

  // Append file with "baz".
  await writeToFile(file, "baz", {
    flag: "a"
  });

  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, "utf8")).toBe("barbaz");
});

test("it can receive createDirMode option", async () => {
  const file = `${BASE_DIR}/foo/bar/test.txt`;

  expect(fs.existsSync(file)).toBe(false);

  await writeToFile(file, "foo bar", {
    createDirMode: 0o740
  });

  expect(fs.existsSync(file)).toBe(true);
  expect(getPermission(`${BASE_DIR}/foo/bar`)).toBe("740");
  expect(getPermission(`${BASE_DIR}/foo/bar`)).toBe("740");
});

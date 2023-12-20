export default function (plop) {
  plop.setGenerator("exercise", {
    description: "add exercise",
    prompts: [
      {
        type: "input",
        name: "chapter",
        message: "chapter name",
      },
      {
        type: "input",
        name: "exercise",
        message: "exercise name",
      },
      {
        type: "input",
        name: "add_package_json",
        message: "Fill (yes) to add a package.json, and other to not",
      },
      {
        type: "input",
        name: "add_test",
        message: "Fill (yes) to add test file, and other to not",
      },
    ],
    actions: (data) => {
      const actions = [];
      actions.push({
        type: "add",
        path: "src/{{chapter}}/{{exercise}}/{{exercise}}.js",
        templateFile: "plop-templates/exercise.hbs",
      });

      if (data.add_package_json === "yes") {
        actions.push({
          type: "add",
          path: "src/{{chapter}}/package.json",
          templateFile: "plop-templates/package.hbs",
        });
      }

      if (data.add_test === "yes") {
        actions.push({
          type: "add",
          path: "src/{{chapter}}/{{exercise}}/test/{{exercise}}.js",
          templateFile: "plop-templates/exercise.test.hbs",
        });
      }

      return actions;
    },
  });
}

module.exports = {
    default: {
        requireModule: ["ts-node/register"],
        require: ["./features/step_definitions/**/*.ts"],
        format: ["progress"],
        parallel: 4,
        publishQuiet: true
    }
};

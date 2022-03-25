import Form from "@rjsf/core";
import { FormLayout, Select, TextField } from "@shopify/polaris";
import React from "react";

const schema = {
  required: ["title"],
  definitions: {
    data: {
      type: "string",
      enum: [
        "id",
        "title",
        "description",
        "price",
        "compare at price",
        "handle",
      ],
    },
    type: {
      type: "string",
      enum: ["metafield", "data"],
    },
    dataType: {
      properties: {
        type: {
          type: "string",
          enum: ["metafield", "data"],
          default: "metafield",
        },
      },
      required: ["type"],
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["data"],
                },
              },
            },
            {
              properties: {
                type: {
                  enum: ["metafield"],
                },
                metafield: {
                  $ref: "#/definitions/data",
                },
              },
              required: ["metafield"],
            },
          ],
        },
      },
    },
  },
  properties: {
    title: { type: "string", title: "Title", default: "A new task" },
    conditional: {
      $ref: "#/definitions/dataType",
    },
  },
};

const log = (type) => console.log.bind(console, type);

export default function FormBuilder() {
  return (
    <div style={{ maxWidth: "100%", width: "600px" }}>
      <Form
        schema={schema}
        widgets={{
          TextWidget: ({ ...props }) => <TextField {...props} />,
          SelectWidget: ({ label, options, ...props }) => {
            console.log(props);
            return (
              <Select label={null} options={options.enumOptions} {...props} />
            );
          },
        }}
        ObjectFieldTemplate={(props) => {
          console.log("AnyOfField", props);
          return (
            <FormLayout>
              {props.properties.map((element) => element.content)}
            </FormLayout>
          );
        }}
        FieldTemplate={(props) => {
          const {
            id,
            classNames,
            label,
            help,
            required,
            description,
            errors,
            children,
          } = props;
          return children;
        }}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")}
      />
    </div>
  );
}

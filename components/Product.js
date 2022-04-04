import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  removeNodeAtPath,
  toggleExpandedForAll,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import { Button, Card, Layout, Page, TextField } from "@shopify/polaris";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/theme/material.css";
import { toXML } from "jstoxml";
import get from "lodash.get";
import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

const productVariant = {
  id: "gid://shopify/ProductVariant/40837153390778",
  title: "Amber",
  price: "969.54",
  product: {
    handle: "replica-poul-henningsen-cantilever-floor-lamp",
    title: "Cantilever Floor Lamp",
  },
  selectedOptions: [
    {
      name: "Choose Colour",
      value: "Amber",
    },
  ],
  metafields: {
    edges: [
      {
        node: {
          namespace: "global",
          key: "sku",
          value: "ILLUMINATES WITH BEAUTIFUL WARM LIGHT",
        },
      },
      {
        node: {
          namespace: "global",
          key: "heading-1",
          value: "ILLUMINATES WITH BEAUTIFUL WARM LIGHT",
        },
      },
      {
        node: {
          namespace: "global",
          key: "heading-2",
          value: "MINIMALIST MODERN STYLE",
        },
      },
      {
        node: {
          namespace: "global",
          key: "description-image-1",
          value:
            "<img src='https://res.cloudinary.com/dfgbpib38/image/upload/f_auto/media/catalog/product//c/a/cantilever_floor_lamp_desc_01_1.png'>",
        },
      },
      {
        node: {
          namespace: "global",
          key: "description-image-2",
          value:
            "<img src='https://res.cloudinary.com/dfgbpib38/image/upload/f_auto/media/catalog/product//c/a/cantilever_floor_lamp_desc_02_1.png'>",
        },
      },
      {
        node: {
          namespace: "global",
          key: "short-description-1",
          value:
            '<p><span data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Poul Henningsen considers making an economical and glare free light an art. It must have been what he has in mind when he designed the PH 4.5 - 3.5 Floor Lamp Tall in the winter of 1925 for large exhibition hall in Copenhagen, Denmark called \\&quot;Forum\\&quot;. The combination of diffused reflection and a logarithmic shade curve gave PH the opportunity to control a fixture\'s glare and shading, as each shade would evenly decrease the amount of light emitted according to their distance from the bulb. It is clean and contemporary and will look chic in any corner of your home.&quot;}" data-sheets-userformat="{&quot;2&quot;:768,&quot;11&quot;:4,&quot;12&quot;:0}">Poul Henningsen considers making an economical and glare free light an art. The combination of diffused reflection and a logarithmic shade curve gave the opportunity to control a fixture\'s glare and shading, as each shade would evenly decrease the amount of light emitted according to their distance from the bulb. It is clean and contemporary and will look chic in any corner of your home.</span></p>',
        },
      },
      {
        node: {
          namespace: "global",
          key: "short-description-2",
          value:
            '<style type="text/css"><!--\r\ntd {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}\r\n--></style>\r\n<style type="text/css"><!--\r\ntd {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}\r\n--></style>\r\n<style type="text/css"><!--\r\ntd {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}\r\n--></style>\r\n<style type="text/css"><!--\r\ntd {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}\r\n--></style>\r\n<p><span data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;A floor lamp that provides soft, warm, glowing illumination is the driving force behind Designer Wow Designer Wow Reproduction of the PH 4.5 - 3.5 Floor Lamp Tall by Poul Henningsen. This exquisite floor lamp is based on the principle of a reflecting multi-shade system, creating a harmonious and glare-free light for your room. Standing at 163 cm tall, the floor lamp is composed of white opal handblown glass shades which have been sandblasted on the undersides for uniform light distribution in a slender stand and base that comes in a choice of black, chrome of gold finish. An elegant finish for corners or beside sofas.&quot;}" data-sheets-userformat="{&quot;2&quot;:768,&quot;11&quot;:4,&quot;12&quot;:0}">If its glare-free lightning you want, its glare-free lightning you are getting with Designer Wow reproduction of Cantilever Floor Lamp. Tastefully styled with quality glass diffuser shade atop a brass-plated steel stem and base, in amber finish. Create your own ambiance by aiming warm white color where you want it while casting shadows compellingly. Ideal lighting for any occasion. An elegant finish for corners or beside sofas.</span></p>',
        },
      },
      {
        node: {
          namespace: "global",
          key: "promotion",
          value: "50",
        },
      },
      {
        node: {
          namespace: "global",
          key: "leading-time",
          value: "Delivered 12 - 18 weeks",
        },
      },
      {
        node: {
          namespace: "global",
          key: "in-stock",
          value: "false",
        },
      },
      {
        node: {
          namespace: "global",
          key: "inspired-of",
          value: "Poul Henningsen",
        },
      },
      {
        node: {
          namespace: "global",
          key: "description",
          value:
            '<table class="no-border">\r\n<tbody>\r\n<tr>\r\n<td style="border: none;">\r\n<ul>\r\n<li style="text-align: left;"><strong>Material:</strong> Brass Style Finish Base / Glass Shade</li>\r\n<li style="text-align: left;"><strong>Feature:</strong> Adjustable Swing Arm</li>\r\n<li style="text-align: left;"><strong>Bulb Included:</strong> No</li>\r\n<li style="text-align: left;"><strong>Wattage:</strong> E27 1 * 60W (Recommended)</li>\r\n<li style="text-align: left;"><strong>Warranty:</strong> 5 Years</li>\r\n</ul>\r\n</td>\r\n<td style="border: none;">\r\n<ul>\r\n<li style="text-align: left;"><strong>Assembly:</strong> Basic Assembly Required</li>\r\n<li style="text-align: left;"><strong>Instructions:</strong> Included</li>\r\n<li style="text-align: left;"><strong>Look:</strong> Modern</li>\r\n<li style="text-align: left;"><strong>Electrical:</strong> Electric Cord and UK / Euro Plug Included</li>\r\n</ul>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>',
        },
      },
    ],
  },
};
const treeData = [
  { key: "g:id", value: "id" },
  { key: "title", value: "title" },
  { key: "link", value: "link" },
  { key: "g:price", value: "price" },
  { key: "description" },
  { key: "g:product_type" },
  { key: "g:image_link" },
  {
    key: "g:shipping",
    children: [{ key: "g:country" }, { key: "g:price" }],
  },
  { key: "g:country" },
  { key: "g:price" },
  { key: "g:condition" },
  { key: "g:availability" },
  { key: "g:status" },
  { key: "g:shipping_weight" },
  { key: "g:google_product_category" },
  { key: "g:fb_product_category" },
  { key: "new node", type: "add" },
];
const maxDepth = 5;

const alertNodeInfo = ({ node, path, treeIndex }) => {
  const objectString = Object.keys(node)
    .map((k) => (k === "children" ? "children: Array" : `${k}: '${node[k]}'`))
    .join(",\n   ");

  global.alert(
    "Info passed to the button generator:\n\n" +
      `node: {\n   ${objectString}\n},\n` +
      `path: [${path.join(", ")}],\n` +
      `treeIndex: ${treeIndex}`
  );
};

export class App extends React.Component {
  state = {
    searchString: "",
    searchFocusIndex: -1,
    searchFoundCount: 0,
    treeData,
  };

  handleTreeOnChange = (treeData) => {
    this.setState({ treeData });
  };

  handleSearchOnChange = (e) => {
    this.setState({
      searchString: e.target.value,
    });
  };

  selectPrevMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1,
    });
  };

  selectNextMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0,
    });
  };

  toggleNodeExpansion = (expanded) => {
    this.setState((prevState) => ({
      treeData: toggleExpandedForAll({
        treeData: prevState.treeData,
        expanded,
      }),
    }));
  };
  componentDidUpdate(prevProps, prevState) {
    // eslint-disable-next-line react/prop-types
    this.props?.onChange(
      toXML(
        {
          item: this.state.treeData.map(({ key, value }) => {
            return {
              [key]: value && value.length && get(productVariant, value),
            };
          }),
        },
        {
          header: true,
          indent: "  ",
        }
      )
    );
  }
  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;
    console.log();
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `.wrapper {
                height:  calc(100vh - 52px);
                width: 100%;
                margin: 0;
              }

              .wrapper {
                display: flex;
                flex-direction: column;
              }

              .bar-wrapper {
                margin-top: 5px;
                margin-left: 5px;
              }

              .tree-wrapper {
                height: calc(100% - 0px);
              }

              .previous {
                margin-left: 10px;
              }

              .next,
              .collapse {
                margin-right: 10px;
                margin-left: 5px;
              }
              .rst__rowContents{
                background: none;
                box-shadow: none;
                border: none;
              }
              .rst__moveHandle{
                flex-shrink:0
              }
              `,
          }}
        ></style>
        <div className="wrapper">
          <div className="tree-wrapper">
            <SortableTree
              treeData={treeData}
              onChange={this.handleTreeOnChange}
              onMoveNode={({ node, treeIndex, path }) =>
                global.console.debug(
                  "node:",
                  node,
                  "treeIndex:",
                  treeIndex,
                  "path:",
                  path
                )
              }
              maxDepth={maxDepth}
              onlyExpandSearchedNodes={true}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              canDrag={({ node }) => !node.noDragging}
              canDrop={({ nextParent }) =>
                !nextParent || !nextParent.noChildren
              }
              searchFinishCallback={(matches) =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex:
                    matches.length > 0 ? searchFocusIndex % matches.length : 0,
                })
              }
              isVirtualized={true}
              generateNodeProps={(rowinfo) => {
                const key = rowinfo.node?.key || null;
                const value = rowinfo.node?.value || null;
                const path = rowinfo.path;
                if (rowinfo?.node?.type === "add") {
                  return {
                    title: (
                      <div style={{ display: "flex", gap: "1em" }}>
                        <TextField
                          style={{ fontSize: "1.1rem" }}
                          placeholder="key"
                          value={key}
                          onChange={(key) => {
                            this.setState((state) => ({
                              treeData: changeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                                newNode: { ...rowinfo.node, key },
                              }),
                            }));
                          }}
                        />
                        <TextField
                          style={{ fontSize: "1.1rem" }}
                          placeholder="value"
                          value={value}
                          onChange={(value) => {
                            this.setState((state) => ({
                              treeData: changeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                                newNode: { ...rowinfo.node, value },
                              }),
                            }));
                          }}
                        />
                      </div>
                    ),

                    buttons: [
                      <Button
                        key="add"
                        onClick={() =>
                          this.setState((state) => {
                            let newState = {
                              treeData: changeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                                newNode: { ...rowinfo.node, type: null },
                              }),
                            };
                            newState = {
                              treeData: newState.treeData.concat({
                                type: `add`,
                              }),
                            };
                            return newState;
                          })
                        }
                      >
                        Add Node
                      </Button>,
                    ],
                  };
                }
                return {
                  title: (
                    <div style={{ display: "flex", gap: "1em" }}>
                      <TextField
                        style={{ fontSize: "1.1rem" }}
                        placeholder="key"
                        value={key}
                        onChange={(key) => {
                          this.setState((state) => ({
                            treeData: changeNodeAtPath({
                              treeData: state.treeData,
                              path,
                              getNodeKey,
                              newNode: { ...rowinfo.node, key },
                            }),
                          }));
                        }}
                      />
                      <TextField
                        style={{ fontSize: "1.1rem" }}
                        placeholder="value"
                        value={value}
                        onChange={(value) => {
                          this.setState((state) => ({
                            treeData: changeNodeAtPath({
                              treeData: state.treeData,
                              path,
                              getNodeKey,
                              newNode: { ...rowinfo.node, value },
                            }),
                          }));
                        }}
                      />
                    </div>
                  ),
                  buttons: [
                    <Button
                      size="slim"
                      key={"edit"}
                      onClick={() =>
                        this.setState((state) => ({
                          treeData: addNodeUnderParent({
                            treeData: state.treeData,
                            parentKey: rowinfo.path[rowinfo.path.length - 1],
                            expandParent: true,
                            getNodeKey,
                            newNode: {
                              key: `new title`,
                              subkey: "new subtitle",
                            },
                            addAsFirstChild: state.addAsFirstChild,
                          }).treeData,
                        }))
                      }
                    >
                      +
                    </Button>,
                    <Button
                      size="slim"
                      key={`delete`}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete this node?`
                          )
                        ) {
                          this.setState((state) => ({
                            treeData: removeNodeAtPath({
                              treeData: state.treeData,
                              path: rowinfo.path,
                              getNodeKey,
                            }),
                          }));
                        }
                      }}
                    >
                      -
                    </Button>,
                  ],
                };
              }}
            />
          </div>
        </div>
      </>
    );
  }
}
export default function Product() {
  const [state, setState] = useState();
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section oneThird>
          <Card title="Schema">
            <Card.Section>
              <App onChange={setState} />
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card title="Feed preview">
            <Card.Section>
              <CodeMirror
                value={state}
                options={{
                  mode: "xml",
                  theme: "material",
                  lineNumbers: true,
                }}
                onChange={(editor, data, value) => {}}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

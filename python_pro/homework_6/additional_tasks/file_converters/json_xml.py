import xml.etree.ElementTree as ET

from json_csv import JsonWriter, get_data_from_json


class XmlWriter:

    def write_to_xml_file(self, data: str, file_path: str) -> None:
        """
        Writes a string of XML data to a specified file.
        :param data: A string containing the XML data to be written to the file. The string should be well-formed
                    XML to ensure valid output.
        :param file_path: The file path where the XML data should be written.
        """
        with open(file_path, 'w') as file:
            file.write(data)


class XmlAdapter(JsonWriter, XmlWriter):

    def write_to_json_file(self, data: list[dict], file_path: str = 'files/json_xml_result.xml') -> None:
        """
        Converts a list of dictionaries to XML format and calls a method to write it to a file.
        :param data: A list of dictionaries where each dictionary represents a data record. The keys of the
                    dictionaries will be used as element names in the XML, and the values will be set as the
                    text content of those elements.
        :param file_path: The file path where the XML data will be written.
        """
        xml_data_ = ET.Element('Countries')
        for country_data in data:
            tmp_elem = ET.SubElement(xml_data_, 'CountryDescription')
            for key, value in country_data.items():
                tmp_inner_elem = ET.SubElement(tmp_elem, key)
                tmp_inner_elem.text = str(value)
        self.write_to_xml_file(ET.tostring(xml_data_).decode(), file_path)


class JsonAdapter(XmlWriter, JsonWriter):

    def write_to_xml_file(self, data: str, file_path: str = 'files/json_xml_result.json') -> None:
        """
        Converts XML data (in string format) to JSON format and writes it to a file.
        :param data: A string containing well-formed XML data.
        :param file_path: The file path where the JSON data will be written.
        """
        tree = ET.fromstring(data)
        json_data_ = convert_xml_to_dict(tree)
        self.write_to_json_file(json_data_, file_path)


def convert_xml_to_dict(element: ET.Element) -> list[dict] | str | None:
    """
    Recursively converts an XML element and its children into a dictionary,
    or returns text for leaf elements.
    :param element: The XML element to be converted into a dictionary or string.
    :return: Returns a list of dictionaries representing the XML structure.
    """
    if len(element) == 0:
        return element.text
    result = {}
    for child in element:
        if child.tag not in result:
            result[child.tag] = convert_xml_to_dict(child)
        else:
            if isinstance(result[child.tag], list):
                result[child.tag].append(convert_xml_to_dict(child))
            else:
                result[child.tag] = [result[child.tag], convert_xml_to_dict(child)]
    return [result]


def get_data_from_xml(file_path: str = 'files/xml_resource.xml') -> str:
    """
    Parses an XML file and returns its content as a string.
    :param file_path: The file path of the XML file to be read.
    :return: A string containing the entire XML content, including the root element and all child elements,
            in a serialized format.
    """
    tree = ET.parse(file_path)
    root = tree.getroot()
    return ET.tostring(root).decode()


if __name__ == '__main__':
    json_data = get_data_from_json()
    xml_adapter = XmlAdapter()
    xml_adapter.write_to_json_file(json_data)
    xml_data = get_data_from_xml()
    json_adapter = JsonAdapter()
    json_adapter.write_to_xml_file(xml_data)

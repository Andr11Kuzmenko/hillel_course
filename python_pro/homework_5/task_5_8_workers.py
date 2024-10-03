import json
import datetime
from configparser import ConfigParser
from abc import abstractmethod
from pathlib import Path


class Strategy:

    @abstractmethod
    def update_configs(self, config_file):
        pass


class JsonWorker(Strategy):

    def update_configs(self, config_file):
        """
        update a json file with current params
        :param config_file:
        """
        json_dict = json.load(config_file)
        current_datetime = datetime.datetime.now()
        json_dict["lastTimeOpened"] = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
        json_dict["lastDirectory"] = str(Path().absolute())
        config_file.seek(0)
        config_file.truncate()
        json.dump(json_dict, config_file)


class IniWorker(Strategy):

    def update_configs(self, config_file):
        """
        update an ini file with current params
        :param config_file:
        """
        conf = ConfigParser()
        conf.read_file(config_file)
        conf.set(
            "settings",
            "lastTimeOpened",
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        )
        conf.set("settings", "lastDirectory", str(Path().absolute()))
        config_file.seek(0)
        config_file.truncate()
        conf.write(config_file)

from task_5_8_workers import JsonWorker, IniWorker


class ContextManager:

    def __init__(self, file_path: str = 'resources/task_5_8.ini'):
        self._file_path = file_path
        self._file = None

        if not self._file_path.endswith('.json') and not self._file_path.endswith('.ini'):
            raise NameError('File must have either \'.json\' or \'.ini\' extension\'')

        self._strategy = JsonWorker() if self._file_path.endswith('.json') else IniWorker()

    def __enter__(self) -> "ContextManager":
        """
        when enters a context, opens a config file and updates data
        :return: self
        """
        self._file = open(self._file_path, 'r+')
        self._strategy.update_configs(self._file)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._file.close()


with ContextManager() as file:
    print('Configs updated')

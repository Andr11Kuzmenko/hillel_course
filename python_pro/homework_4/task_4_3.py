import importlib
import inspect
from inspect import getmembers, isfunction, isclass, isbuiltin


def analyze_module(module_name: str) -> None:
    """
    prints information about a module
    :param module_name:
    """
    module_ = importlib.import_module(module_name)
    print(f"Analyzing module: {module_name}")
    print_class_info(module_)
    print()
    print_function_info(module_)
    print(end="\n\n")


def print_class_info(module_: object) -> None:
    """
    prints information about classes in a module
    :param module_:
    """
    classes_ = getmembers(module_, isclass)
    print("Classes:")
    if not classes_:
        print(f"No classes found in module {module_.__name__}")
    else:
        for name, class_ in classes_:
            print(f"{name}")


def print_function_info(module_: object) -> None:
    """
    prints information about functions in a module
    :param module_:
    """
    functions_ = getmembers(module_, lambda f: isfunction(f) or isbuiltin(f))
    print("Functions:")
    if not functions_:
        print(f"No functions found in module {module_.__name__}")
    else:
        for name, function in functions_:
            try:
                print(
                    f"{name}({', '.join(inspect.signature(function).parameters.keys())})"
                )
            except ValueError:
                pass


analyze_module("numbers")
analyze_module("math")

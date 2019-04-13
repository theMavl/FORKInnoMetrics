"""
Logger implementation
"""
import json
import logging.config

import os

from api.constants import INNOMETRICS_PATH

logger = logging.getLogger(__name__)
logging_config_file = os.path.join(INNOMETRICS_PATH, 'logging.json')
with open(logging_config_file, 'rt') as f:
    config = json.load(f)
    handlers = config.get('handlers', [])
    for handler_key in handlers:
        handler = handlers[handler_key]
        filename = handler.get('filename')
        if filename:
            handler['filename'] = os.path.join(INNOMETRICS_PATH, filename)

logging.config.dictConfig(config)

